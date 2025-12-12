-- 1. Increment Space Usage
-- Called after a successful file upload to keep stats in sync without counting rows every time.
create or replace function increment_space_usage(row_id uuid, size_inc bigint, count_inc int)
returns void as $$
begin
  update spaces 
  set total_size_bytes = total_size_bytes + size_inc,
      file_count = file_count + count_inc
  where id = row_id;
end;
$$ language plpgsql;

-- 2. Increment Download Count
-- Called when a user requests a download link.
create or replace function increment_download_count(row_id uuid)
returns void as $$
begin
  update files 
  set download_count = download_count + 1 
  where id = row_id;
end;
$$ language plpgsql;